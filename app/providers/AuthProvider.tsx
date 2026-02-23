"use client";
// "use client";

// import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { getuser } from "@/redux/slice/AuthSlice";

// export default function AuthProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const dispatch = useAppDispatch();
//   const { isAuthenticated } = useAppSelector((state) => state.auth);

//   useEffect(() => {
//     // Only fetch user if already authenticated (has token)
//     const token = document.cookie.includes('token') || 
//                   localStorage.getItem('token') || 
//                   sessionStorage.getItem('token');
    
//     if (token || isAuthenticated) {
//       dispatch(getuser());
//     }
//   }, [dispatch, isAuthenticated]);

//   return <>{children}</>;
// }



import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { getuser } from "@/redux/slice/AuthSlice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { fetched, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch if not already fetched
    if (!fetched) {
      dispatch(getuser());
    }
  }, [dispatch, fetched]); // Add fetched to dependency array

  // Optional: Prevent flash of unauthenticated content while initial load
  if (!fetched && loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    ); // or a loading spinner
  }

  return <>{children}</>;
}