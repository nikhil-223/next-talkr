import Image from "next/image";
import AuthForm from "./components/AuthForm";

export default function Home() {
	return (
		<div
			className="
		flex
		min-h-full
		flex-col
		justify-center
		py-12
		sm:px-6
		lg:px-8
		bg-gray-100
		">
			<div className="sm:mx-auto sm:w-auto flex flex-col items-center sm:max-w-md">
				<div className="relative w-16 h-16">
					<Image
						alt="logo"
						fill
						className="mx-auto w-auto"
						src="/images/logo.svg"
					/>
				</div>
				<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
					Welcome to Talkr
				</h2>
			</div>
			<AuthForm />
		</div>
	);
}
