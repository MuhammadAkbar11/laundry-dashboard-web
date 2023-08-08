/* eslint-disable react/display-name */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Form, Spinner, Dropdown } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useNotification from '@hooks/useNotification';
import { getCustomersService } from '@/services/customerService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLaundryQueueCreateContext } from '@utils/context/Laundry/LaundryQueue/LaundryQueueCreateContext';
import DebouncedInput from '@components/Inputs/DebouncedInput';
import FeatherIcon from '@components/Icons/FeatherIcon';
import {
  CreateLaundryQueueInputTypes,
  createLaundryQueueSchema,
} from '@utils/schema/laundryQueueSchema';
import { postLaundryQueueService } from '@/services/laundryQueueService';
import BoxButton from '@components/Buttons/BoxButton';

type Props = {};

type CustomToggleProps = {
  isInvalid: boolean;
  invalidMessage: string | null;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
};

const CustomToggle = React.forwardRef<HTMLButtonElement, CustomToggleProps>(
  ({ children, onClick, isInvalid, invalidMessage }, ref) => (
    <Form.Group className="mb-3">
      <Form.Label>Pelanggan</Form.Label>
      <Form.Control
        as="button"
        ref={ref}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          onClick(e);
        }}
        isInvalid={isInvalid}
        type="button"
        className="w-100 form-control form-control-lg d-flex justify-content-between "
      >
        {children}
        <span>
          <FeatherIcon name="ChevronDown" />
        </span>
      </Form.Control>
      {invalidMessage ? (
        <Form.Control.Feedback type="invalid" className=" pt-1">
          {invalidMessage}
        </Form.Control.Feedback>
      ) : null}
    </Form.Group>
  )
);

function FormCreateLaundryQueue({}: Props) {
  const [searchCsTerm, setSearchCsTerm] = React.useState('');

  const notif = useNotification();

  const createLaundryQueueCtx = useLaundryQueueCreateContext();

  const methods = useForm<CreateLaundryQueueInputTypes>({
    resolver: zodResolver(createLaundryQueueSchema),
  });

  const {
    register,
    handleSubmit,
    setValue: setFormValues,
    formState: { errors: formErrors },
  } = methods;

  const fetchLaundryQueueQueryKey = React.useMemo(() => {
    return createLaundryQueueCtx.data?.fetchQueryKey as any[];
  }, [createLaundryQueueCtx.data]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: CreateLaundryQueueInputTypes) =>
      postLaundryQueueService(values),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: fetchLaundryQueueQueryKey,
      });
    },
  });

  const fetchCustomerDataOptions = React.useMemo(
    () => ({
      pageIndex: 0,
      pageSize: 10,
      sorting: [{ id: 'name', desc: false }],
      searchTerm: searchCsTerm,
    }),
    [searchCsTerm]
  );

  const customerDataQuery = useQuery(
    ['customers-laundry-queue', { searchTerm: searchCsTerm }],
    () => getCustomersService(fetchCustomerDataOptions),
    { keepPreviousData: true }
  );

  const onSubmitHandler = (inputs: CreateLaundryQueueInputTypes) => {
    createLaundryQueueCtx.onSetLoading(true);

    mutation.mutate(inputs, {
      onSuccess(data) {
        notif.success(data?.message as string);
        createLaundryQueueCtx.onSetLoading(false);
        createLaundryQueueCtx.onCloseForm();
      },
      onError(error: any) {
        createLaundryQueueCtx.onSetLoading(false);
        const errMessage = error?.message || 'Gagal menambahkan data!';
        notif.danger(errMessage);
        createLaundryQueueCtx.onCloseForm();
        notif.danger(errMessage);
      },
    });
  };

  return (
    <Form
      method="POST"
      className="h-100 d-flex flex-column justify-content-between "
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <div>
        <input type="hidden" {...register('customerId')} />
        <Dropdown drop="down-centered" align="end" autoClose="inside">
          <Dropdown.Toggle
            as={CustomToggle}
            className=""
            id="dropdown-customers"
            isInvalid={!!formErrors?.customerId}
            invalidMessage={formErrors?.customerId?.message || null}
          >
            {createLaundryQueueCtx?.data?.customer?.name || 'Pilih pelanggan'}
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="w-100 "
            style={{ transform: 'translateY(50px)' }}
          >
            <Dropdown.Header>
              <DebouncedInput
                value={searchCsTerm || ''}
                onChange={(value) => {
                  setSearchCsTerm(String(value));
                }}
                className="form-control form-control-lg py-2 "
                placeholder="Cari data pelanggan"
              />
            </Dropdown.Header>
            <Dropdown.Divider />
            {customerDataQuery?.isLoading || customerDataQuery?.isFetching ? (
              <Dropdown.ItemText className="text-center">
                <Spinner variant="primary" size="sm" />
              </Dropdown.ItemText>
            ) : (
              <>
                {customerDataQuery?.data?.rows?.map((cs) => {
                  const isActive =
                    createLaundryQueueCtx.data?.customer?.customerId ===
                    cs.customerId;

                  return (
                    <Dropdown.Item
                      key={cs.customerId}
                      onClick={() => {
                        createLaundryQueueCtx.onSetData({
                          customer: cs,
                          fetchQueryKey: fetchLaundryQueueQueryKey,
                        });
                        setFormValues('customerId', cs.customerId);
                      }}
                      className=" d-flex  align-items-center gap-2 "
                      active={isActive}
                    >
                      <span>{cs.name}</span>
                    </Dropdown.Item>
                  );
                })}
                {customerDataQuery?.data?.rows?.length === 0 ? (
                  <Dropdown.ItemText className="text-center">
                    Data tidak di temukan
                  </Dropdown.ItemText>
                ) : null}
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="deliveryType">Pilih Jenis Pengiriman</Form.Label>
          <Form.Select
            size="lg"
            id="deliveryType"
            // placeholder="Masukan alamant pelanggan"
            isInvalid={!!formErrors?.deliveryType}
            {...register('deliveryType')}
            defaultValue=""
          >
            <option value="" disabled>
              Pilih Jenis Pengiriman
            </option>
            <option value="DELIVERED">Delivered (Jemput Antar)</option>
            <option value="PICKUP">Self Pickup (Antar Jemput Sendiri)</option>
          </Form.Select>
          {formErrors?.deliveryType?.message ? (
            <Form.Control.Feedback type="invalid" className=" pt-1">
              {formErrors?.deliveryType?.message}
            </Form.Control.Feedback>
          ) : null}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="note">Catatan</Form.Label>
          <Form.Control
            size="lg"
            as="textarea"
            type="text"
            id="note"
            placeholder="Masukan alamant pelanggan"
            isInvalid={!!formErrors?.note}
            rows={3}
            {...register('note')}
          />
          {formErrors?.note?.message ? (
            <Form.Control.Feedback type="invalid" className=" pt-1">
              {formErrors?.note?.message}
            </Form.Control.Feedback>
          ) : null}
        </Form.Group>
      </div>
      <div className="pb-2 d-flex flex-column flex-sm-row gap-2 justify-content-end ">
        <BoxButton
          variant="slate"
          icon="UserPlus"
          size="lg"
          disabled={createLaundryQueueCtx?.isLoading}
          iconPos="end"
          className="order-1 order-sm-2 text-dark"
          onClick={() => {
            createLaundryQueueCtx.onSetData({
              customer: null,
              fetchQueryKey: fetchLaundryQueueQueryKey,
            });
            createLaundryQueueCtx.onSetFormType('newCustomer');
          }}
        >
          Pelanggan Baru
        </BoxButton>
        <BoxButton
          icon="Save"
          type="submit"
          size="lg"
          isLoading={createLaundryQueueCtx?.isLoading}
          iconPos="end"
          className="order-1 order-sm-2"
        >
          Buat Antrian
        </BoxButton>
      </div>
    </Form>
  );
}

export default FormCreateLaundryQueue;
