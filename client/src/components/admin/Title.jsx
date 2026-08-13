const Title = ({ text1, text2 }) => {
  return (
    <h1 className='text-3xl font-medium'>
      {text1} <span className='text-primary'>{text2}</span>
    </h1>
  );
};

export default Title;