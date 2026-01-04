import Loading from "@/components/Loading";
import { Alert } from "@/lib/Alert";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import UserService from "@/services/UserService";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function AccountPassword() {
  type IFormDetails = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  const { token } = useGlobalProvider();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleSubmit, control } = useForm<IFormDetails>({
    values: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
  });

  async function onSubmit(form: IFormDetails) {
    setIsSubmitting(true);

    try {
      const payload = {
        newPassword: form.newPassword,
        currentPassword: form.currentPassword
      }

      const response = await UserService.updateUserPassword(token as string, payload);

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

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 space-y-3">
        <div className="space-y-3">
          <div>
            <label className="block">Senha atual <span className="text-red-500">*</span></label>
            <Controller name="currentPassword" control={control} rules={{ required: true }} render={({ field }) => (
              <Password {...field} inputRef={field.ref} className="p-inputtext-sm" feedback={false} toggleMask={true} />
            )} />
          </div>
          <div>
            <label className="block">Nova senha <span className="text-red-500">*</span></label>
            <Controller name="newPassword" control={control} rules={{ required: true }} render={({ field }) => (
              <Password {...field} inputRef={field.ref} className="p-inputtext-sm" feedback={false} toggleMask={true} />
            )} />
          </div>
          <div>
            <label className="block">Confirmar senha <span className="text-red-500">*</span></label>
            <Controller name="confirmPassword" control={control} rules={{ required: true }} render={({ field }) => (
              <Password {...field} inputRef={field.ref} className="p-inputtext-sm" feedback={false} toggleMask={true} />
            )} />
          </div>
          <div>
            <Button label="Salvar" severity="success" type="submit" />
          </div>
        </div>
      </form>
    </>
  )
}