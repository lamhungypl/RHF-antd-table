import React, { useRef, useState } from 'react';

import 'antd/dist/antd.css';
import './index.scss';
import { Table, Button, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Controller, useForm, UseFormReturn } from 'react-hook-form';
import NumberFormat from 'react-number-format';
import clsx from 'clsx';
import { DeleteOutlined } from '@ant-design/icons';
import { get, toNumber } from 'lodash';
import { Images } from './constant';
import { validateRow } from './utils';
import { ErrorMessage } from '@hookform/error-message';

interface ColumnAction {
  onDelete: (...params: any) => void;
  onValidateQuantity: (...params: any) => any;
}
const useColumn = (actions: ColumnAction, tableForm: UseFormReturn<any>) => {
  const { onDelete, onValidateQuantity } = actions;
  const columns = React.useMemo<ColumnsType<any>>(
    () => [
      {
        dataIndex: 'imageUrl',
        render: urlValue => {
          return (
            <img
              src={urlValue}
              alt="prod_img"
              style={{
                width: 50,
                height: 50,
              }}
            />
          );
        },
      },
      {
        title: 'name',
        dataIndex: 'name',
        key: 'name',
        render: (_, record) => {
          return (
            <div>
              <div>{record.name}</div>
            </div>
          );
        },
      },
      {
        title: 'quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width: 100,
        render: (_, record, index) => {
          const errorStatus = get(tableForm.formState.errors, `product[${index}].quantity.type`, 'default');
          const errorMessage = get(tableForm.formState.errors, `product[${index}].quantity.message`, '');
          const classNames = clsx(
            'product__input',
            { error: ['required', 'quantityError'].includes(errorStatus) },
            { waring: ['quantityWarning'].includes(errorStatus) }
          );
          return (
            <div>
              <div style={{ position: 'relative' }}>
                <Controller
                  render={({ field: { onChange, ...renderProps } }) => {
                    return (
                      <NumberFormat
                        {...renderProps}
                        onValueChange={target => {
                          onChange();
                          const afterValue = target.floatValue ? target.floatValue : 1;
                          tableForm.setValue(`product[${index}].quantity`, afterValue);
                        }}
                        // forcus on validate fail not work here
                        // onFocus={(
                        //   event: React.FocusEvent<HTMLInputElement>
                        // ) => {
                        //   event.target.select();
                        // }}
                        //
                        className={classNames}
                        decimalScale={0}
                        isNumericString
                        allowNegative={false}
                      />
                    );
                  }}
                  control={tableForm.control}
                  defaultValue={record.quantity}
                  name={`product[${index}].quantity`}
                  rules={{
                    validate: {
                      required: data => {
                        return !data ? 'requiredField' : undefined;
                      },
                      quantityError: data => {
                        const { error } = onValidateQuantity(data, record, index);
                        return error.type === 'error' ? error.message : undefined;
                      },
                      quantityWarning: data => {
                        const { error } = onValidateQuantity(data, record, index);
                        return error.type === 'warning' ? error.message : undefined;
                      },
                    },
                  }}
                />
                {['required', 'quantityError', 'quantityWarning'].includes(errorStatus) && (
                  <Tooltip title={errorMessage} color={errorStatus === 'quantityWarning' ? 'yellow' : 'red'}>
                    <span className={`input_error ${errorStatus === 'quantityWarning' ? 'waring' : ''}`} />
                  </Tooltip>
                )}
              </div>
            </div>
          );
        },
      },

      {
        title: 'price',
        key: 'g',
        width: 150,
        render: (_, record, index) => {
          const errorMessage = get(tableForm.formState.errors, `product[${index}].price.message`, '');

          return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div style={{ position: 'relative' }}>
                <Controller
                  render={({ field: { onChange, ...renderProps } }) => {
                    return (
                      <NumberFormat
                        {...renderProps}
                        onValueChange={target => {
                          onChange();

                          tableForm.setValue(`product[${index}].price`, target.floatValue);
                        }}
                        isNumericString
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        prefix="$"
                      />
                    );
                  }}
                  name={`product[${index}].price`}
                  defaultValue={record.price}
                  control={tableForm?.control}
                  rules={{
                    validate: {
                      required: data => {
                        console.log('price', data);
                        const inValidPrice = toNumber(data);
                        return !inValidPrice ? 'inValidPrice' : undefined;
                      },
                    },
                  }}
                />
                {get(tableForm.formState.errors, `product[${index}].price.type`, '') === 'required' && (
                  <Tooltip title={errorMessage} color="red">
                    <span className="input_error" />
                  </Tooltip>
                )}
              </div>
            </div>
          );
        },
      },

      {
        title: () => (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {'action'}
          </div>
        ),
        dataIndex: 'c',
        key: 'h',
        width: 55,
        render: (value, record, index) => {
          const handleDelete = () => {
            if (onDelete) {
              onDelete(record, index);
            }
          };
          return (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <Button onClick={handleDelete}>
                <DeleteOutlined />
              </Button>
            </div>
          );
        },
      },
    ],
    [tableForm, onDelete, onValidateQuantity]
  );

  return columns;
};

const data = [
  {
    id: '1',
    name: 'John Brown',
    quantity: 4,
    price: 12,
    imageUrl: Images.sample,
  },
  {
    id: '21',
    name: 'hon BrJown',
    quantity: 3,
    price: 14,
    imageUrl: Images.sample,
  },
];
const App = () => {
  const form = useForm({ mode: 'onBlur' });
  const shippingDayRef = useRef<HTMLInputElement>();

  const [mode, setMode] = useState('send');

  const deleteRow = () => {};

  const columns = useColumn(
    {
      onDelete: deleteRow,
      onValidateQuantity: validateRow,
    },
    form
  );
  const onFail = error => {
    console.log(error);
  };
  const onEdit = () => {
    setMode('edit');
    form.handleSubmit(data => {
      console.log({ data });
    }, onFail)();
  };
  const onSent = () => {
    setMode('send');
    form.handleSubmit(data => {
      console.log({ data });
    }, onFail)();
  };
  return (
    <div>
      <form>
        <Button onClick={onEdit}>Edit</Button>
        <div>
          <span>Shipping Controller:</span>
          <Controller
            render={({ field: { onChange, ...renderProps } }) => {
              return (
                <NumberFormat
                  {...renderProps}
                  getInputRef={shippingDayRef}
                  decimalScale={0}
                  isNumericString
                  allowNegative={false}
                />
              );
            }}
            // forcus using ref
            // onFocus={() => {
            //   if (shippingDayRef.current) {
            //     shippingDayRef.current.focus();
            //   }
            // }}
            control={form.control}
            name="shippingDays"
            rules={{
              validate: {
                required: data => {
                  console.log({ data, mode });
                  if (mode === 'send') {
                    // not empty and gt 1
                    return !toNumber(data) ? 'invalidDays' : undefined;
                  }
                  // not create mode, input is valid by default
                  return undefined;
                },
              },
            }}
          />
          <span> day</span>
        </div>
        <ErrorMessage errors={form.formState.errors} name="shippingDays" />

        <div>
          <span>Shipping input:</span>
          <input
            {...form.register('shippingDaysInput', {
              validate: {
                required: data => {
                  console.log({ data, mode });
                  if (mode === 'send') {
                    // not empty and gt 1
                    return !toNumber(data) ? 'invalidDays' : undefined;
                  }
                  // not create mode, input is valid by default
                  return undefined;
                },
              },
            })}
          />

          <span> day</span>
        </div>
        <div>
          <span>random input:</span>
          <input {...form.register('random')} />
        </div>
        <ErrorMessage errors={form.formState.errors} name="random" />

        <ErrorMessage errors={form.formState.errors} name="shippingDaysInput" />

        <Table columns={columns} dataSource={data} pagination={false} />

        <Button onClick={onSent}>Submit</Button>
      </form>
    </div>
  );
};
export default App;
