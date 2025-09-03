// src/pages/librarian/SignUp.jsx
import React from "react";
import SignUpForm from "../../components/auth/SignUpForm";

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="w-full max-w-md rounded-xl">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUp;
