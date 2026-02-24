import React from "react";
import Layout from "./Layout/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "./pages/Index";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import CategoryDetails from "./pages/category/CategoryDetails";
import AddCategory from "./pages/category/AddCategory";
import EditCategory from "./pages/category/EditCategory";
import BlogDetails from "./pages/blog/BlogDetails";
import AddBlog from "./pages/blog/AddBlog";
import EditBlog from "./pages/blog/EditBlog";
import SingleBlogDetails from "./pages/SingleBlogDetails";
import BlogByCategory from "./pages/blog/BlogByCategory";
import SearchResult from "./pages/SearchResult";
import Comments from "./pages/Comments";
import User from "./pages/User";
import AuthRouteProtection from "./components/AuthRouteProtection";
import OnlyAdminAllowed from "./components/OnlyAdminAllowed";


export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Index />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "blog/:category/:blog",
          element: <SingleBlogDetails/>
        },
        {
          path: "blog/:category",
          element: <BlogByCategory/>
        },
        {
          path: "search",
          element: <SearchResult/>
        },
        {
          element: <AuthRouteProtection/>,
          children: [
            {
              path: "blog",
              element: <BlogDetails/>
            },
            {
              path: "blog/add",
              element: <AddBlog/>
            },
            {
              path: "blog/edit/:blogid",
              element: <EditBlog/>
            },
            {
              path: "comments",
              element: <Comments/>
            },
          ]
        },
        {
          element: <OnlyAdminAllowed/>,
          children: [
            {
              path: "categories",
              element: <CategoryDetails />,
            },
            {
              path: "category/add",
              element: <AddCategory />,
            },
            {
              path: "category/edit/:category_id",
              element: <EditCategory />,
            },
            {
              path: "users",
              element: <User/>
            }  
          ]
        }
      ],
    },
    {
      path: "/sign-in",
      element: <SignIn />,
    },
    {
      path: "/sign-up",
      element: <SignUp />,
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
