import { Inbox, KeyRound, User, UserPlus, UserRoundPen } from "lucide-react";
import FormInput from "./FormInput";
import Button from "../Button";
import React from "react";

interface FormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  Terms: boolean;
}

interface Error {
  fullName: string;
  username: string;
  email: string;
  password: string;
  Terms: boolean;
}

interface SignUpFormProps {
  formData: FormData;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  UpdateField: (fild: keyof FormData, value: string | boolean) => void;
  errors?: Error;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  formData,
  onSubmit,
  UpdateField,
  errors,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormInput
        type="text"
        Icon={User}
        label="Full Name"
        value={formData.fullName}
        onChange={(e) => UpdateField("fullName", e.target.value)}
        error={errors?.fullName}
      />

      <FormInput
        type="text"
        Icon={UserRoundPen}
        label="Username"
        value={formData.username}
        onChange={(e) => UpdateField("username", e.target.value)}
        error={errors?.username}
      />
      <FormInput
        type="email"
        Icon={Inbox}
        label="Email"
        value={formData.email}
        onChange={(e) => UpdateField("email", e.target.value)}
        error={errors?.email}
      />
      <FormInput
        type="password"
        Icon={KeyRound}
        label="Password"
        onChange={(e) => UpdateField("password", e.target.value)}
        value={formData.password}
        ispassword={true}
        showpassword={showPassword}
        setshowpassword={setShowPassword}
        error={errors?.password}
      />
      <div className="flex justify-start">
        <FormInput
          type="checkbox"
          checkboxValue={formData.Terms}
          onChange={(e) => UpdateField("Terms", e.target.checked)}
          label={
            <span className="text-xs text-gray-600">
              I agree to the{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Terms & Conditions
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Privacy Policy
              </button>
            </span>
          }
          isCheckbox={true}
        />
      </div>
      {errors?.Terms && <p className="text-red-500 text-xs">{errors?.Terms}</p>}
      <Button
        type="submit"
        text="Create Account"
        IconLeft={<UserPlus size={18} />}
      />
    </form>
  );
};

export default SignUpForm;
