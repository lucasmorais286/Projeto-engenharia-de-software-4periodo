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
	},
	{
		content: 'Carrossel de marketing',
		icon: BarChart,
	},
	{
		content: 'Foco em nutrição',
		icon: Salad,
	},
	{
		content: 'Feed promocional',
		icon: Tag,
	},
	{
		content: 'Posts ao bem-estar',
		icon: Leaf,
	},
	{
		content: 'Aumentar engajamento',
		icon: TrendingUp,
	},
];

export { defaultPrompts, itemsSideBar };

