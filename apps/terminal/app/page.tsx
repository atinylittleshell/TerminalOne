import dynamic from 'next/dynamic';

const Terminal = dynamic(() => import('../components/Terminal'), {
  ssr: false,
});

const Page = () => {
  return <Terminal />;
};

export default Page;
