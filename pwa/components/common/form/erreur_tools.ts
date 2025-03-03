export function dispatchFormErrors(form, response) {
    console.log(form);
    console.log(response);
    if ('graphQLErrors' in response.error) {
        response.error.graphQLErrors.forEach((error) => {
            if ('violations' in error.extensions) {
                error.extensions.violations.forEach((violation) => {
                    form.setFields([
                        {
                            name: violation.path,
                            errors: [violation.message],
                        },
                    ]);
                });
            } else {
                // eslint-disable-next-line no-console
                console.error(error);
            }
        });
    } else {
        // eslint-disable-next-line no-console
        console.error(response.error);
    }
}

export function dispatchFormErrorsWitRenaming(form, violations, nameErrorField, formField) {
    const errorField = violations.find((violation) => violation.path === nameErrorField);
    if (errorField) {
        form.setFields([
            {
                name: formField,
                errors: [errorField.message],
            },
        ]);
    }

    return form;
}