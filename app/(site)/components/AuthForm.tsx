"use client";

import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, FieldValues, useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios, { AxiosResponse } from "axios";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import AuthSocialButton from "./AuthSocialButton";
import { useRouter } from "next/navigation";
import getSession from "@/app/actions/getSession";

const AuthForm = () => {
	const session = useSession();
	console.log(session);
	const router = useRouter();
	const [variant, setVariant] = useState("LOGIN");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (session?.status === "authenticated") {
			router.push("/users");
		}
	}, [session?.status, router]);

	const toggleVariant = useCallback(() => {
		if (variant === "LOGIN") {
			setVariant("REGISTER");
		} else {
			setVariant("LOGIN");
		}
	}, [variant]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		setIsLoading(true);
		if (variant === "REGISTER") {
			const registerApi = async () => {
				let response: AxiosResponse | undefined;

				try {
					response = await axios.post("/api/register", data);
				} catch (error) {
					toast.error("Something went wrong");
				} finally {
					setIsLoading(false);
				}

				if (response && response.status === 200) {
					toast.success("Registered successfully");
				}
			};

			registerApi();
		}

		if (variant === "LOGIN") {
			signIn("credentials", {
				...data,
				redirect: false,
			})
				.then((callback) => {
					if (callback?.error) {
						toast.error("Invalid credentials");
					}

					if (callback?.ok && !callback?.error) {
						toast.success("Logged in!");
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	const socialAction = (action: string) => {
		setIsLoading(true);

		signIn(action, { redirect: false })
			.then((callback) => {
				if (callback?.error) {
					toast.error("Invalid credentials");
				}

				if (callback?.ok && !callback?.error) {
					toast.success("Logged in!");
				}
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
			<div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
				<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
					{variant === "REGISTER" && (
						<Input
							id="name"
							label="Name"
							disabled={isLoading}
							register={register}
							errors={errors}
						/>
					)}
					<Input
						id="email"
						label="Email address"
						type="email"
						disabled={isLoading}
						register={register}
						errors={errors}
					/>
					<Input
						id="password"
						label="Password"
						type="password"
						disabled={isLoading}
						register={register}
						errors={errors}
					/>
					<div>
						<Button disabled={isLoading} fullWidth type="submit">
							{variant === "LOGIN" ? "Sign in" : "Register"}
						</Button>
					</div>
				</form>
				<div className="mt-6">
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300" />
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="bg-white px-2 text-gray-500">
								Or continue with
							</span>
						</div>
					</div>

					<div className="mt-6 flex gap-2">
						<AuthSocialButton
							icon={BsGithub}
							onClick={() => socialAction("github")}
						/>
						<AuthSocialButton
							icon={BsGoogle}
							onClick={() => socialAction("google")}
						/>
					</div>
				</div>
				<div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
					<div>
						{variant === "LOGIN" ? "New to Talkr?" : "Already have an account?"}
					</div>
					<div onClick={toggleVariant} className="uderline cursor-pointer">
						{variant === "LOGIN" ? "Create an account" : "Login"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthForm;
