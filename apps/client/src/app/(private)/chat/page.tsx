import { defaultPrompts } from '@common/constants/chat';
import { TextArea } from '@components/index';
import { Button } from '@components/ui/button';
import { Send } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-between h-screen w-full">
			<div className="flex flex-col items-center mt-12 w-[70%]">
				<div className="p-3 mx-auto rounded-md border-[1.5px] border-gray-200 w-fit mb-4 shadow-sm">
					<Image src="/logo.png" alt="Logo" width={48} height={48} />
				</div>
				<p className="text-3xl text-center font-semibold bg-gradient-to-r from-purple-500 to-purple-400 text-transparent bg-clip-text mb-2">
					Gere posts com o Post AI
				</p>
				<p className="text-[12px] font-light text-center mx-auto text-gray-700">
					Escolha seu prompt abaixo ou escreva seu próprio texto para gerar um post incrível!
				</p>

				<div className="flex flex-wrap justify-center items-center lg:px-28 gap-4 w-full mt-8 min-[1460px]:grid min-[1460px]:grid-cols-3">
					{defaultPrompts.map((prompt, index) => (
						<Button
							key={index}
							className="rounded-2xl w-52 flex items-center justify-center text-gray-500 border-gray-300 font-regular p-3"
							variant="outline"
						>
							<prompt.icon className="" />
							{prompt.content}
						</Button>
					))}
				</div>
			</div>

			<footer className="my-4 w-[70%]">
				<TextArea
					placeholder="Descreva seu post aqui..."
					iconRight={<Send size={20} color="purple" />}
					showCount
					maxLength={200}
				/>
			</footer>
		</div>
	);
}
