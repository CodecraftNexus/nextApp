import { Inbox, KeyRound, LogIn, User } from "lucide-react";
import FormInput from "./FormInput";
import React from "react";
import Button from "../Button";

interface FormData {
  email: string;
  password: string;
   rememberMe: boolean;
}

interface SignInFormProps {
  formData: FormData;
  onsubmit: React.FormEventHandler<HTMLFormElement>;
  UpdateField: (fild: keyof FormData, value: string | boolean) => void;
  loading : boolean
}


const SignInForm: React.FC<SignInFormProps> = ({
  formData,
  onsubmit,
  UpdateField,
  loading
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form className="space-y-5" onSubmit={onsubmit}>
      <FormInput
        type="email"
        Icon={Inbox}
        label={"email"}
        onChange={(e) => UpdateField("email", e.target.value)}
        value={formData.email}
      />
      <FormInput
        type="password"
        Icon={KeyRound}
        label="Password"
        value={formData.password}
        onChange={(e) => UpdateField("password", e.target.value)}
        ispassword={true}
        showpassword={showPassword}
        setshowpassword={setShowPassword}
      />
      <div className="w-full flex justify-between items-center">
        <FormInput
          type="checkbox"
          onChange={(e) => UpdateField("rememberMe", e.target.checked)}
          label="Remember me"
          isCheckbox={true}
          checkboxValue={formData.rememberMe}
        />
        <Button
          className="w-auto py-0"
          text="Forgot Password?"
          variant="link"
        />
      </div>
      <Button
        text="Sign In"
        type="submit"
        loading = {loading}
        IconLeft={<LogIn size={18} />}  
      />

     
    </form>
  );
};


export default SignInForm;