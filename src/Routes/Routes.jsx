import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Root } from "../Pages/Root/Root";
import { Loader } from "../Components/Loader";
import { Home } from "../Pages/Home/Home";
import { ErrorPage } from "../Pages/ErrorPage";
import PrivateRoute from "./PrivateRoute";
import { PageWithTitle } from "../Components/PageWithTitle";
import CreateAssignment from "../Pages/Assignment/CreateAssignment";
import AssignmentsPage from "../Pages/Assignment/AssignmentsPage";
import MySubmittedAssignments from "../Pages/Assignment/MySubmittedAssignments";
import PendingAssignments from "../Pages/Assignment/PendingAssignments";
import Leaderboard from "../Pages/Leaderboard/Leaderboard";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import UpdateAssignmentPage from "../Pages/Assignment/UpdateAssignmentPage";
import ViewAssignment from "../Pages/Assignment/ViewAssignment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <PageWithTitle title="GroupStudyHub - Home">
              <Home />
            </PageWithTitle>
          </Suspense>
        ),
      },
      {
        path: "/create-assignment",
        element: (
          <PrivateRoute>
            <PageWithTitle title="Create Assignment - GroupStudyHub">
              <CreateAssignment />
            </PageWithTitle>
          </PrivateRoute>
        ),
      },

      {
        path: "/assignments",
        element: (
          <PageWithTitle title="Assignments - GroupStudyHub">
            <AssignmentsPage />
          </PageWithTitle>
        ),
      },
      {
        path: "/view/:id",
        element: (
          <PrivateRoute>
            <ViewAssignment />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-attempts",
        element: (
          <PrivateRoute>
            <PageWithTitle title="My Submitted Assignments - GroupStudyHub">
              <MySubmittedAssignments />
            </PageWithTitle>
          </PrivateRoute>
        ),
      },

      {
        path: "/pending",
        element: (
          <PrivateRoute>
            <PageWithTitle title="My Pending Assignments - GroupStudyHub">
              <PendingAssignments />
            </PageWithTitle>
          </PrivateRoute>
        ),
      },
      {
        path: "/leaderboard",
        element: (
          <PageWithTitle title="Leaderboard - GroupStudyHub">
            <Leaderboard />
          </PageWithTitle>
        ),
      },
      {
        path: "/update/:id",
        element: (
          <PrivateRoute>
            <PageWithTitle title="Update Assignment - GroupStudyHub">
              <UpdateAssignmentPage />
            </PageWithTitle>
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <PageWithTitle title="Login - GroupStudyHub">
            <Login />
          </PageWithTitle>
        ),
      },
      {
        path: "/register",
        element: (
          <PageWithTitle title="Register - GroupStudyHub">
            <Register />
          </PageWithTitle>
        ),
      },
    ],
  },
]);
