
const PageNotFound = () => {
  return (
    <main
      className={`landing-page relative flex flex-col justify-center items-center min-h-svh w-full bg-gray-100`}
    >
      <p
        className={`absolute top-0 flex justify-between items-center gap-2 h-fit w-full p-7 text-4xl font-bold max-md:flex-col max-md:align-center max-md:justify-start`}
      >
        <span className="max-md:text-3xl">Todolist</span>
        <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent max-md:text-3xl">
          PRO V1
        </span>
      </p>
      <div
        className={`flex flex-col justify-center items-center gap-4 h-fit w-full p-10`}
      >
        <p
          className={`flex justify-center items-center gap-2 h-fit w-full text-3xl font-bold`}
        >
          <span className="max-md:text-3xl">404 - </span>
          <span className="bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent max-md:text-3xl">
            Page Not Found
          </span>
        </p>
        <button
          type="button"
          className={`w-fit text-amber-600 p-2 rounded-md hover:text-amber-800 hover:bg-amber-200 hover:shadow-xl hover:shadow-amber-600/50`}
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </main>
  );
};

export default PageNotFound;
