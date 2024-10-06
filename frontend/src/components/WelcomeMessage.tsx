export const WelcomeMessage = ({ name }: { name: string }) => {
  return (
    <div className="flex">
      <div className="font-bold text-lg">Hello</div>
      <div className="font-semibold ml-2 text-lg">Dr {name}</div>
    </div>
  );
};
