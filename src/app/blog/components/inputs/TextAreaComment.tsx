export default function TextAreaComment({ error, ...props }: any) {
  return (
    <>
      {error && <small className="text-red-500">{error}</small>}
      <textarea
        {...props}
        className="bg-transparent resize-none w-full outline-none focus:outline-none h-auto max-h-[200px] overflow-y-hidden transition-all duration-300 ease-in-out"
      />
    </>
  );
}
