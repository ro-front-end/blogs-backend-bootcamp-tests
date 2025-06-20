import BlogList from "@/components/blogList";
import CreateEditModal from "@/components/createEditModal";

function BlogsPage() {
  return (
    <>
      <div className="flex justify-end">
        <CreateEditModal />
      </div>
      <div className="">
        <BlogList />
      </div>
    </>
  );
}

export default BlogsPage;
