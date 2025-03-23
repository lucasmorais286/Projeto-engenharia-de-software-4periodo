import { BarChart, History, Leaf, Lightbulb, Salad, SquarePen, Tag, TrendingUp } from 'lucide-react';

const itemsSideBar = [
	{
		title: 'Novo Chat',
		url: '/chat',
		icon: SquarePen,
	},
	{
		title: 'Histórico de Posts',
		url: '/history',
		icon: History,
	},
];

const defaultPrompts = [
	{
		content: 'Post motivacional',
		icon: Lightbulb,
		message: 'Crie um post motivacional inspirador para engajar meu público e transmitir uma mensagem positiva. Utilize uma linguagem envolvente e emocional.'
	},
	{
		content: 'Carrossel de marketing',
		icon: BarChart,
		message: 'Gere um carrossel de marketing persuasivo destacando os principais benefícios do meu produto/serviço. Utilize gatilhos mentais para aumentar o interesse do público.'
	},
	{
		content: 'Foco em nutrição',
		icon: Salad,
		message: 'Crie um post informativo sobre nutrição, destacando dicas práticas e embasadas para uma alimentação saudável. Use um tom educativo e acessível.'
	},
	{
		content: 'Feed promocional',
		icon: Tag,
		message: 'Elabore um post promocional para divulgar uma oferta especial, utilizando uma abordagem persuasiva e chamativa para atrair clientes.'
	},
	{
		content: 'Posts ao bem-estar',
		icon: Leaf,
		message: 'Desenvolva um post sobre bem-estar e qualidade de vida, abordando hábitos saudáveis e dicas práticas para melhorar a rotina do público.'
	},
	{
		content: 'Aumentar engajamento',
		icon: TrendingUp,
		message: 'Crie um post estratégico para aumentar o engajamento do meu perfil, utilizando chamadas para ação e perguntas interativas para estimular a participação do público.'
	},
];

export { defaultPrompts, itemsSideBar };
