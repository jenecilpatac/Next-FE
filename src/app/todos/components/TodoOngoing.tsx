import useFetch from "../hooks/fetchData";
import SingleStatusLoader from "./loaders/SingleStatusLoader";

export default function TodoOngoing({
  isSingleStatusRefresh,
  handleDeleteTodo,
  handleStatusUpdate,
  setIsEdited,
  isEdited,
  setId,
}: any) {
  const { data, loading }: any = useFetch(
    "/todos/status/ongoing",
    isSingleStatusRefresh
  );

  const handleToEditTodo = (id: number) => {
    setIsEdited((isEdited: any) => ({
      [id]: !isEdited[id],
    }));
    setId(id);
  };

  return (
    <>
      {loading ? (
        <SingleStatusLoader />
      ) : (
        <>
          {data?.todo?.length > 0 ? (
            data.todo.map((item: any, index: number) => (
              <div key={index} className={`relative`}>
                <div
                  className={`
                    group relative overflow-hidden rounded-md p-4 w-full text-white shadow-xl border
                    transition-all duration-500 ease-in-out transform
                    bg-blue-400
                    border-t-[15px] border-t-blue-500
                    h-32
                    ${index === 0 ? "mt-2" : "-mt-20"}
                    hover:md:scale-125 hover:scale-110 hover:md:translate-x-12 hover:z-50 hover:h-auto
                  `}
                >
                  {/* Title */}
                  <h2 className="text-lg font-bold truncate mb-2 -mt-3">
                    {item.title}
                  </h2>

                  <button
                    type="button"
                    onClick={() => handleToEditTodo(item.id)}
                    className="absolute top-1 right-10 text-violet-500 hover:scale-110 transition-all duration-150 ease-in-out"
                  >
                    {isEdited[item.id] ? (
                      <>
                        <i className="fas fa-xmark"></i>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-pen"></i>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteTodo(item.id)}
                    className="absolute top-1 right-3 text-red-500 hover:scale-110 transition-all duration-150 ease-in-out"
                  >
                    <i className="fas fa-trash text-lg"></i>
                  </button>

                  <hr className="border-gray-300 my-2" />

                  {/* Content */}
                  <p className="mt-2 break-words whitespace-pre-wrap">
                    {item.content}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex justify-center gap-4 mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(item.id, "pending")}
                      className="hover:-translate-y-1 transition-transform duration-300"
                    >
                      <i className="far fa-history rounded-full border border-red-500 bg-red-500 hover:bg-red-600 text-white p-2 text-xs"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(item.id, "done")}
                      className="hover:-translate-y-1 transition-transform duration-300"
                    >
                      <i className="far fa-check-double rounded-full border border-blue-900 bg-blue-800 hover:bg-blue-900 text-white p-2 text-xs"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusUpdate(item.id, "cancelled")}
                      className="hover:-translate-y-1 transition-transform duration-300"
                    >
                      <i className="far fa-ban rounded-full border border-red-900 bg-red-800 hover:bg-red-900 text-white p-2 text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-5">
              <p className="text-center text-xl font-bold">No ongoing tasks</p>
            </div>
          )}
        </>
      )}
    </>
  );
}
