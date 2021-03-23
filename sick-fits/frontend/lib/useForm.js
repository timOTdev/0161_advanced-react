import { useState } from 'react';

export default function useForm(initial = {}) {
    // Create a state object for our inputs
    const [ inputs, setInputs ] = useState(initial);

    function handleChange(e) {
        let { value, name, type } = e.target;

        // HTML forms always provide a string even if number,
        // we want to handle specific cases.
        if (type === 'number') {
            value = parseInt(value);
        }
        if (type === 'file') {
            value[0] = e.target.files;
        }

        setInputs({
            ...inputs,
            [name]: value,
        })
    }

    function resetForm() {
        setInputs(initial);
    }

    function clearForm() {
        // Loops over the object and makes the values blank.
        // Remake the object.
        const blankState = Object.fromEntries(
          Object.entries(inputs).map(([key, val]) => [key, ""])
        );

        setInputs(blankState);
    }

    // Return things for surfacing.
    return {
        inputs,
        handleChange,
        resetForm,
        clearForm
    }
}
