"use client";
import AuthBackground from "@assets/auth.jpg";
import WhiteLogo from "@assets/white-logo.png";
import { Login } from "@components/loginCard";
import { Register } from "@components/registerCard";
import { AuthContainerProps } from "@common/interfaces/auth";

export default function AuthenticationUi({ isRegister, toggleAuthMode }: AuthContainerProps) {
	return (
		<div className="flex h-screen w-full bg-[#f5f2f7]">
		<div className="w-[60%] relative">
			<img src={AuthBackground.src} alt="" className="h-full w-full object-cover rounded-r-2xl" />

			<img
				src={WhiteLogo.src}
				alt=""
				className="absolute inset-0 m-auto w-64 h-auto"
				/>
		</div>

		<div className="w-[40%] p-8 flex flex-col justify-center">
			{isRegister ? <Register toggleAuthMode={toggleAuthMode} /> : <Login toggleAuthMode={toggleAuthMode} />}
		</div>
	</div>
	);
}
