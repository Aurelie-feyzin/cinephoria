import InputField from "../common/form/InputField";
import {customMaxLength, REQUIRED} from "../common/form/validator_tools";
import React, {ReactNode} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import ButtonSubmit from "../common/button/ButtonSubmit";
import {Employee, EmployeeInput} from "../../model/User";

const EmployeeForm = ({onSubmit, employeeData, children}:
                      {onSubmit:SubmitHandler<EmployeeInput>, employeeData?: Employee, children?: ReactNode }) => {
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<EmployeeInput, Error>({
        defaultValues: employeeData ? {
            ...employeeData
        } : {}
    });

    return <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-black p-6 rounded-lg shadow-md">
        <InputField register={register("firstName", {...REQUIRED, ...customMaxLength(255)})}
                    name='firstName'
                    label='Prénom'
                    error={errors.firstName?.message}
        />
        <InputField register={register("lastName", {...REQUIRED, ...customMaxLength(255)})}
                    name='lastName'
                    label='Nom'
                    error={errors.lastName?.message}
        />
        <InputField register={register("email", {...REQUIRED, ...customMaxLength(180)})}
                    type='email'
                    name='email'
                    label='Email'
                    error={errors.email?.message}
        />
        <ButtonSubmit />
        {children}
    </form>
}

export default EmployeeForm;