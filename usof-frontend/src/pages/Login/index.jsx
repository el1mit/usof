import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { postLogin, selectIsAuth } from '../../redux/slices/authSlice.js'

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './Login.module.scss';

export const Login = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();

    const { register, handleSubmit, setError, clearErrors, formState: { errors, isValid }, } = useForm({
        defaultValues: {
            login: 'operym',
            email: 'xilag46581@canyona.com',
            password: 'qwerty12345',
        },
        mode: 'onSubmit',
    });

    const onSubmit = async (values) => {
        const data = await dispatch(postLogin(values));

        if (data.error?.message) {
            setError('apiError', { type: 'custom', message: data.error.message });
        } else if ('token' in data?.payload) {
            window.localStorage.setItem('token', data.payload.token);
        }
    };

    if (isAuth) {
        return <Navigate to='/' />
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant='h5'>
                Account Login
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label='Login'
                    error={Boolean(errors?.login)}
                    helperText={errors?.login?.message}
                    {...register('login', {
                        required: "Enter login",
                        minLength: {
                            value: 4,
                            message: "Login must be from 4 to 20 characters"
                        },
                        maxLength: {
                            value: 20,
                            message: "Login must be from 4 to 20 characters"
                        },
                        pattern: {
                            value: /^\S*$/,
                            message: "Whitespaces aren't allowed",
                        }
                    })}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label='E-Mail'
                    type='email'
                    error={Boolean(errors?.email)}
                    helperText={errors.email?.message}
                    {...register('email', {
                        required: 'Enter email',
                        minLength: {
                            value: 4,
                            message: "Email must be at least 4 characters"
                        },
                        pattern: {
                            value: /^\S*$/,
                            message: "Whitespaces aren't allowed",
                        }
                    })}
                    fullWidth
                />

                <TextField
                    className={styles.field}
                    label='Password'
                    type='password'
                    error={Boolean(errors?.password)}
                    helperText={errors.password?.message}
                    {...register('password', {
                        required: 'Enter password',
                        minLength: {
                            value: 6,
                            message: "Password must be from 6 to 22 characters"
                        },
                        maxLength: {
                            value: 22,
                            message: "Password must be from 6 to 22 characters"
                        },
                        pattern: {
                            value: /^\S*$/,
                            message: "Whitespaces aren't allowed",
                        }
                    })}
                    fullWidth
                />

                <Button disabled={!isValid} onClick={() => clearErrors()} type='submit' size='large' variant='contained' fullWidth>
                    Login
                </Button>
                <Typography variant='body1' sx={{ color: 'red' }}>{errors.apiError?.message}</Typography>
            </form>
            <Link to="/register">Don't have an account</Link>
            <Link to="/password-reset">Forget password</Link>
        </Paper>
    );
};
