import Loading from "@/components/Loading";
import { Alert } from "@/lib/Alert";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import UserService from "@/services/UserService";
import formatDate from "@/utils/formatDate";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AccountDetail() {
  type IFormDetails = {
    name: string;
    email: string;
    createdAt: string;
  }

  const { user, setUser, token } = useGlobalProvider();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit } = useForm<IFormDetails>({
    values: {
      name: user!.name!,
      email: user!.email!,
      createdAt: formatDate(user!.createdAt!, "D [de] MMMM [de] YYYY"),
    }
  });

  async function onSubmit(form: IFormDetails) {
    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name,
        email: form.email
      }

      const response = await UserService.updateUserDetails(token as string, payload);
      setUser({ 
        ...user,
        ...payload
       });

      Alert.success("", response.message);
      close();
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {isSubmitting && <Loading />}

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-x-4 space-y-3">
        <div className="space-y-3">
          <div>
            <label className="block">Nome <span className="text-red-500">*</span></label>
            <InputText {...register("name", { required: true })} className="p-inputtext-sm" />
          </div>
          <div>
            <label className="block">E-mail <span className="text-red-500">*</span></label>
            <InputText {...register("email", { required: true })} className="p-inputtext-sm" />
          </div>
          <div>
            <label className="block">Membro desde</label>
            <InputText {...register("createdAt", { required: true, disabled: true })} className="p-inputtext-sm" />
          </div>
          <div>
            <Button label="Salvar" severity="success" type="submit" />
          </div>
        </div>
      </form>
    </>
  )
}
