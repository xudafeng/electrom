import React, { useState, useEffect } from 'react';
import { Table, Button } from 'antd';
import filesize from 'filesize';
import moment from 'moment';
import PropTypes from 'prop-types';

import styles from './index.module.less';

const { ipcRenderer } = window.require('electron');

const useViewModel = (props) => {
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
        return (
          <div>
            {`type:${webContentInfo.type}|id:${webContentInfo.id}|${webContentInfo.url}`}
          </div>
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
    </div>
  );
}

StatusBoard.PropTypes = {
  eventDataChannelName: PropTypes.string.isRequired,
  eventActionChannelName: PropTypes.string.isRequired,
};

export default StatusBoard;