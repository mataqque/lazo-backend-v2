import * as Yup from 'yup';

export const createSentenceSchema = Yup.object().shape({
    data: Yup.array()
        .of(
            Yup.object().shape({
                spanish: Yup.string().required('El campo spanish es obligatorio'),
                english: Yup.string().required('El campo english es obligatorio')
            })
        )
        .required('El campo data es obligatorio')
        .min(1, 'El array data debe tener al menos un objeto'),
    name: Yup.string().required(),
    cel: Yup.string().required(),
});

export const phoneScheme = Yup.object().shape({
    cel: Yup.string().required('El campo cel es obligatorio'),
})