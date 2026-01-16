import Loading from "@/components/Loading";
import { Alert } from "@/lib/Alert";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import UserService from "@/services/UserService";
import formatDate from "@/utils/formatDate";
import { Trash2Icon, UploadIcon } from "lucide-react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ReactElement, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import AccountLayout from "../layout";
import Image from "next/image";

type IFormDetails = {
  name: string;
  email: string;
  createdAt: string;
  avatar: string | File | null
}

const AccountDetail: NextPageWithLayout = () => {
  const { user, setUser, token } = useGlobalProvider();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangedAvatar, setIsChangedAvatar] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, setValue, getValues, watch } = useForm<IFormDetails>({
    values: {
      name: user!.name!,
      email: user!.email!,
      createdAt: formatDate(user!.createdAt!, "D [de] MMMM [de] YYYY"),
      avatar: user!.avatar as string | null,
    }
  });

  async function onSubmit(form: IFormDetails) {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);

      if (isChangedAvatar) {
        const avatar = getValues("avatar");
        if (avatar) {
          formData.append("avatar", avatar);
        } else {
          formData.append("rmAvatar", "1");
        }
      }

      const response = await UserService.updateUserDetails(token as string, formData);

      setUser({
        ...user,
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar
      });

      if (isChangedAvatar) {
        setValue("avatar", response.data.avatar);
        setIsChangedAvatar(false);
      }

      Alert.success("", response.message);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function onUploadAvatar() {
    if (inputFileRef.current?.files) {
      const file = inputFileRef.current.files[0];
      if (!file) return;

      if (!file.type.startsWith("image") || file.size > 1024 * 1024) { // 1MB
        Alert.info("", "Imagem inválida.");
        return;
      }

      setValue("avatar", file);
      setIsChangedAvatar(true);
      inputFileRef.current.value = "";
    }
  }

  function deleteAvatar() {
    if (isChangedAvatar) {
      URL.revokeObjectURL(getValues("avatar") as string);
    }

    if (inputFileRef.current?.files) {
      inputFileRef.current.value = "";
    }

    setValue("avatar", null);
    setIsChangedAvatar(true);
  }

  return (
    <>
      {isSubmitting && <Loading />}

      <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-6 shadow-sm bg-white p-6 rounded-lg">
        <div className="flex justify-center flex-col">
          {user && (
            <div style={{ width: 120, height: 120, position: "relative", borderRadius: "50%", overflow: "hidden", border: "1px solid lightgray" }}>
              <Image
                src={watch("avatar") ? isChangedAvatar ? URL.createObjectURL(getValues("avatar") as File) : user.avatar as string : "/images/avatar.jpg"}
                alt="Avatar"
                fill
                sizes={`${120}px`}
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          )}
          <div className="flex flex-col items-center mt-3 space-y-3">
            <input
              id="upload-avatar"
              ref={inputFileRef}
              type="file"
              style={{ display: "none" }}
              accept="image/jpg,image/jpeg,image/png"
              onChange={() => onUploadAvatar()}
            />
            <div className="flex justify-center items-center space-x-2">
              <div title="Upload" onClick={() => document.getElementById("upload-avatar")?.click()}><UploadIcon className="cursor-pointer" size={18} /></div>
              {watch("avatar") && <div title="Excluir"><Trash2Icon className="cursor-pointer" onClick={() => deleteAvatar()} size={18} /></div>}
            </div>
            <small>Max.: 1MB</small>
          </div>
        </div>
        <div className="space-y-3 w-full">
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

AccountDetail.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout>
      {page}
    </AccountLayout>
  )
}

export default AccountDetail;