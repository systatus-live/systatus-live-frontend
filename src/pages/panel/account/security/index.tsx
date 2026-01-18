import Loading from "@/components/Loading";
import { Alert } from "@/lib/Alert";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import UserService from "@/services/UserService";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { ReactElement, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AccountLayout from "../layout";
import { SignInTypeEnum } from "@/types/SignInTypeEnum";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Paginator } from "primereact/paginator";
import formatDate from "@/utils/formatDate";
import UAParser from "my-ua-parser";
import { Panel } from "primereact/panel";

type IFormDetails = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountSecurity: NextPageWithLayout = () => {
  const { user, setUser, token } = useGlobalProvider();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authHistory, setAuthHistory] = useState([]);
  const [pagination, setPagination] = useState({
    first: 0,
    rows: 0,
    total: 0
  });
  const { handleSubmit, control } = useForm<IFormDetails>({
    values: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  useEffect(() => {
    if (token) {
      search(new URLSearchParams({ page: "0" }));
    }
  }, [token]);

  const tableColumnList = [
    {
      title: "Data",
      template: (history: any) => <span className="font-medium">{formatDate(history.createdAt, "DD/MM/YYYY HH:mm")}</span>,
      width: "10%"
    },
    {
      title: "Localização",
      template: (history: any) => {
        if (history.locationJson) {
          return <span className="font-medium">{history.locationJson.city} • {history.locationJson.state} • {history.locationJson.country} {history.locationJson.flag}</span>
        }
        return <span className="font-medium">Desconhecida</span>
      },
      width: "30%"
    },
    {
      title: "IP",
      template: (history: any) => <span className="text-sm">{history.ip}</span>,
      width: "20%"
    },
    {
      title: "Dispositivo",
      template: (history: any) => <span className="text-sm">{getDeviceFromAgent(history.userAgent)}</span>,
      width: "30%"
    },
  ]

  async function search(params: URLSearchParams) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await UserService.getAuthHistory(token as string, params);

      setAuthHistory(response.data);
      setPagination(prev => ({
        ...prev,
        rows: response.pagination.rows,
        total: response.pagination.total
      }));
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function onPageChange(event: any) {
    setPagination({
      first: event.first,
      rows: event.rows,
      total: pagination.total
    });
    search(new URLSearchParams({ page: event.page.toString() }));
  }

  async function onSubmit(form: IFormDetails) {
    setIsSubmitting(true);

    try {
      const payload = {
        newPassword: form.newPassword,
        currentPassword: form.currentPassword
      }

      const response = await UserService.updateUserPassword(token as string, payload);
      setUser({ ...user, signinType: SignInTypeEnum.EMAIL_PASSWORD });

      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function getDeviceFromAgent(userAgent: string) {
    const parser = new UAParser(userAgent);
    const parserResults = parser.getResult();
    if (parserResults.browser.name) {
      return `${parserResults.os.name} • ${parserResults.browser.name}/${parserResults.browser.version}`
    }
    return userAgent;
  }

  return (
    <>
      {isSubmitting && <Loading />}


      <Panel header="Alterar Senha">


        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-3">
          {user?.signinType == SignInTypeEnum.EMAIL_PASSWORD ?
            <div className="grid grid-cols-12 gap-3 col-span-12">
              <div className="col-span-12 lg:col-span-4">
                <label className="block">Senha atual <span className="text-red-500">*</span></label>
                <Controller name="currentPassword" control={control} rules={{ required: true }} render={({ field }) => (
                  <Password {...field} inputRef={field.ref} className="p-inputtext-sm" feedback={false} toggleMask={true} />
                )} />
              </div>
            </div> :
            <></>
          }
          <div className="col-span-12 lg:col-span-4">
            <label className="block">Nova senha <span className="text-red-500">*</span></label>
            <Controller name="newPassword" control={control} rules={{ required: true }} render={({ field }) => (
              <Password {...field} inputRef={field.ref} className="p-inputtext-sm" feedback={false} toggleMask={true} />
            )} />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <label className="block">Confirmar senha <span className="text-red-500">*</span></label>
            <Controller name="confirmPassword" control={control} rules={{ required: true }} render={({ field }) => (
              <Password {...field} inputRef={field.ref} className="p-inputtext-sm" feedback={false} toggleMask={true} />
            )} />
          </div>
          <div className="col-span-12">
            <Button label="Salvar" severity="success" type="submit" />
          </div>
        </form>
      </Panel>

      <Panel header="Histórico de login" className="mt-6">
        <div className="border-1 border-gray-200">
          <DataTable
            dataKey="id"
            value={authHistory}
            size="small"
            showGridlines={false}
            stripedRows={false}
            scrollable={true}
            scrollHeight="80vh"
            emptyMessage="&#8203;"
          >
            {tableColumnList.map((col, index) => (
              <Column key={index} header={col.title} body={col.template} style={{ width: col.width }} />
            ))}
          </DataTable>
          <div className="flex items-center justify-center space-x-4">
            <Paginator
              first={pagination.first}
              rows={pagination.rows}
              totalRecords={pagination.total}
              onPageChange={onPageChange}
              template={{ layout: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink" }}
            />
            <small>{pagination.total} incidentes</small>
          </div>
        </div>
      </Panel>
    </>
  )
}

AccountSecurity.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout>
      {page}
    </AccountLayout>
  )
}

export default AccountSecurity;