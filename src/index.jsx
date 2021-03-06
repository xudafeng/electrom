import React, { useState, useEffect } from 'react';
import { Table, Button, Popover } from 'antd';
import filesize from 'filesize';
import moment from 'moment';
import PropTypes from 'prop-types';

import styles from './index.module.less';

const useViewModel = (props) => {
  const { ipcRenderer } = props;
  const [data, setData] = useState([]);

  const openDevTools = webContentInfo => {
    ipcRenderer.send(props.eventActionChannelName, 'openDevTools', webContentInfo);
  };
  const killProcess = item => {
    ipcRenderer.send(props.eventActionChannelName, 'killProcess', item);
  };

  const columns = [
    {
      title: 'PID',
      dataIndex: 'pid',
    },
    {
      title: 'type',
      dataIndex: 'type',
      filters: Array.from(new Set(data.map(item => item.type))).map(item => {
        return {
          text: item,
          value: item,
        };
      }),
      defaultFilteredValue: [],
      onFilter: (value, record) => record.type === value,
      ellipsis: true,
      filterMultiple: false,
    },
    {
      title: 'creationTime',
      dataIndex: 'creationTime',
      sorter: (a, b) => a - b,
      render: (creationTime) => moment(creationTime).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'cpu',
      dataIndex: 'cpu',
      sorter: (a, b) => a - b,
      render: (cpu) => `${(cpu.percentCPUUsage * 100).toFixed(2)}%`,
    },
    {
      title: 'memory',
      dataIndex: 'memory',
      sorter: (a, b) => a - b,
      render: (memory) => filesize(memory.workingSetSize * 1024),
    },
    {
      title: 'webContent',
      dataIndex: 'webContentInfo',
      render: webContentInfo => {
        if (!webContentInfo) return null;
        const urlObj = new URL(webContentInfo.url);
        const extraInfo = [];
        if (urlObj.protocol) {
          extraInfo.push(urlObj.protocol);
        }
        if (urlObj.hash) {
          extraInfo.push(urlObj.hash);
        }
        if (urlObj.search) {
          extraInfo.push(urlObj.search);
        }
        return (
          <Popover content={(
            <div>
              <textarea style={{ border: 'none', minHeight: '30vh' }}>{webContentInfo.url}</textarea>
            </div>
          )} title={null} trigger="hover">
            <div>
              <div>id:{webContentInfo.id} type:{webContentInfo.type}</div>
              <div>{extraInfo.join('|')}</div>
            </div>
          </Popover>
        );
      },
    },
    {
      title: 'control',
      render: item => {
        const webContentInfo = item.webContentInfo;
        return (
          <div className={styles.buttons}>
            <Button
              size="small"
              onClick={() => killProcess(item)}
            >
              kill
            </Button>
            {webContentInfo && !webContentInfo.url.startsWith('devtools:') && (
              <Button
                size="small"
                onClick={() => openDevTools(webContentInfo)}
              >
                devtool
              </Button>
            )}
          </div>
        );
      },
    }
  ];

  const updateAppMetrics = (_, appMetrics) => setData(appMetrics);

  const { eventDataChannelName } = props;
  useEffect(() => {
    ipcRenderer.on(eventDataChannelName, updateAppMetrics);
    return () => {
      ipcRenderer.removeListener(eventDataChannelName, updateAppMetrics);
    };
  }, []);
  
  return {
    state: {
      columns,
      data,
    },
  };
};

const StatusBoard = (props) => {
  const vm = useViewModel(props);
  const {
    state: { columns, data },
  } = vm;
  return (
    <div className={styles.wrapper}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        size="small"
        tableLayout="fixed"
      />
      <footer>
        <a
          onClick={e => {
            e.preventDefault();
            if (props.shell) {
              props.shell.openExternal(e.target.href);
            }
          }}
          href="https://github.com/xudafeng/electrom"
        >
            Electrom
        </a>
      </footer>
    </div>
  );
}

StatusBoard.PropTypes = {
  eventDataChannelName: PropTypes.string.isRequired,
  eventActionChannelName: PropTypes.string.isRequired,
  ipcRenderer: PropTypes.object,
  shell: PropTypes.object,
};

export default StatusBoard;