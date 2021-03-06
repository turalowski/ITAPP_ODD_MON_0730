import React, { useEffect, useState } from 'react';
import { Layout, message } from 'antd';
import NewStock from './NewStock';
import styles from './styles.module.scss';
import swal from '@sweetalert/with-react';
import { CustomButton, CustomTable } from '../../components';
import { FiDelete } from 'react-icons/fi';
import { useStocks } from '../../hooks';

export const Stocks = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stocks, setStocks] = useState([]);
  const { getStocks, deleteStock } = useStocks();

  const getStocksAndUpdateState = () => {
    getStocks()
      .then(response => response.json())
      .then(({ stocks }) => {
        if (stocks) {
          setStocks(stocks);
        }
      });
  };
  const columns = [
    {
      title: '№',
      dataIndex: 'id',
      align: 'left',
      width: 60,
      render: (_value, _item, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'left',
    },

    {
      title: 'Address',
      dataIndex: 'address',
      align: 'left',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      align: 'left',
    },
    {
      title: 'Actions',
      width: 100,
      dataIndex: '_id',
      align: 'center',
      render: data => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FiDelete
            size={20}
            color="#f05545"
            className={styles.deleteButton}
            onClick={() => {
              swal({
                title: 'Warning!',
                text: 'Are you sure to delete this stock?',
                buttons: ['Cancel', 'Delete'],
                dangerMode: true,
              }).then(willDelete => {
                if (willDelete) {
                  deleteStock(data)
                    .then(response => response.json())
                    .then(({ id }) => {
                      if (!id) {
                        return message.error('Error is happened');
                      }
                      message.success('Stock is deleted');
                      getStocksAndUpdateState();
                    });
                }
              });
            }}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getStocksAndUpdateState();
  }, []);

  return (
    <Layout.Content>
      <NewStock
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        getStocksAndUpdateState={getStocksAndUpdateState}
      />
      <div className={styles.Stocks}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: '20px',
          }}
        >
          <CustomButton type="primary" onClick={() => setIsVisible(true)}>
            New Stock
          </CustomButton>
        </div>
        <CustomTable dataSource={stocks} columns={columns} pagination={false} />
      </div>
    </Layout.Content>
  );
};
