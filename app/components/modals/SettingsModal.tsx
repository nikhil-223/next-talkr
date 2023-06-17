"use client";

import Modal from "@/app/components/modals/Modal";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dialog } from "@headlessui/react";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import Button from "@/app/components/Button";
import { User } from "@prisma/client";
import Input from "../inputs/Input";
import Image from "next/image";
import { CldUploadButton } from "next-cloudinary";
import { FieldValues, useForm,SubmitHandler } from "react-hook-form";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface SettingsModalProps {
	isOpen?: boolean;
	onClose: () => void;
    user:User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose,user:currentUser }) => {

	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: currentUser?.name,
			image: currentUser?.image,
		},
	});

	const image = watch('image')

	const handleUpload = (result:any) =>{
		setValue('image',result?.info?.secure_url,{
			shouldValidate:true
		})
	}

	const onSubmit : SubmitHandler<FieldValues> = (data) => {
		setIsLoading(true);
		axios.post("/api/settings", data)
		.then(()=>{
			onClose();
		})
		.catch(()=>{
			toast.error('something went wrong')
		})
		.finally(()=>{
			setIsLoading(false);
		})
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="space-y-12">
					<div className="border-b border-gray-900/10 pb-12">
						<h2
							className="
                text-base 
                font-semibold 
                leading-7 
                text-gray-900
              ">
							Profile
						</h2>
						<p className="mt-1 text-sm leading-6 text-gray-600">
							Edit your public information.
						</p>

						<div className="mt-10 flex flex-col gap-y-8">
							<Input
								disabled={isLoading}
								label="Name"
								id="name"
								errors={errors}
								required
								register={register}
							/>
							<div>
								<label
									htmlFor="photo"
									className="
                    block 
                    text-sm 
                    font-medium 
                    leading-6 
                    text-gray-900
                  ">
									Photo
								</label>
								<div className="mt-2 flex items-center gap-x-3">
									<div className="relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11 ">
										<Image
											alt="Avatar"
											width={50}
											height={50}
											src={
												image || currentUser?.image || "/images/placeholder.jpg"
											}
										/>
									</div>
									<CldUploadButton
										options={{ maxFiles: 1 }}
										onUpload={handleUpload}
										uploadPreset="n1gzclup">
										<Button disabled={isLoading} secondary type="button">
											Change
										</Button>
									</CldUploadButton>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div
					className="
            mt-6 
            flex 
            items-center 
            justify-end 
            gap-x-6
          ">
					<Button disabled={isLoading} secondary onClick={onClose}>
						Cancel
					</Button>
					<Button disabled={isLoading} type="submit">
						Save
					</Button>
				</div>
			</form>
		</Modal>
	);
};

export default SettingsModal;
