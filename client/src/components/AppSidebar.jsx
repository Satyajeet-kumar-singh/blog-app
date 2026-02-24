import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import logo from "@/assets/images/logo-white.png";
import { IoHomeOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { FaBlog } from "react-icons/fa6";
import { VscCommentDiscussion } from "react-icons/vsc";
import { FaRegUserCircle } from "react-icons/fa";
import { FaRegCircleDot } from "react-icons/fa6";
import useFetch from "@/hooks/UseFetch";
import AddCategory from "@/pages/category/AddCategory";
import { useSelector } from "react-redux";

export function AppSidebar() {
   const user = useSelector((state)=> state.user)
   const {
        data: categoryData,
      } = useFetch(`${import.meta.env.VITE_API_BASE_URL}/category/all-category`, {
        method: "GET",
        credentials: "include",
      });
      console.log(categoryData)
  return (
    <>
      <Sidebar>
        <SidebarHeader className="bg-purple-100">
          <img src={logo} width={120} />
        </SidebarHeader>
        <SidebarContent className="bg-violate-100">
          <SidebarGroup />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <IoHomeOutline />
                <Link to="/">Home</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {user && user.isLoggedIn ? 
            <>
              <SidebarMenuItem>
              <SidebarMenuButton>
                <FaBlog />
                <Link to="/blog">Blog</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <VscCommentDiscussion />
                <Link to="/comments">Comments</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            </>
            :
            <>
            </>}

            {user && user.isLoggedIn && user.user.role === "admin" ? 
            <>
              <SidebarMenuItem>
              <SidebarMenuButton>
                  <BiCategoryAlt/>
                <Link to="/categories">Categories</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FaRegUserCircle />
                <Link to="/users">Users</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            </>
            :
            <>
            </>}
          </SidebarMenu>
          <SidebarGroup />

          <SidebarGroup />
          <SidebarGroupLabel>
            Categories
          </SidebarGroupLabel>
          <SidebarMenu>
            {
              categoryData?.category && categoryData?.category?.length > 0 &&
              categoryData?.category?.map(category => 
                <SidebarMenuItem key={category._id}>
              <SidebarMenuButton>
                <FaRegCircleDot />
                <Link to={`/blog/${category.slug}`}>{category.name}</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
              )
            }
          </SidebarMenu>
          <SidebarGroup />
        </SidebarContent>
      </Sidebar>
    </>
  );
}
