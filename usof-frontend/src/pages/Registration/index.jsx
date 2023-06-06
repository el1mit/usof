import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { postRegister, selectIsAuth } from '../../redux/slices/authSlice.js'
import { Navigate, useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './Login.module.scss';

export const Registration = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { register, handleSubmit, setError, clearErrors, watch, formState: { errors, isValid }, } = useForm({
        defaultValues: {
            login: 'Nooo',
            email: 'heficib529@migonom.com',
            full_name: 'Rayan Gosling',
            password: '123456',
            password_confirmation: '123456',
        },
        mode: 'onSubmit',
    });

    const onSubmit = async (values) => {
        const data = await dispatch(postRegister(values));

        if (data.error?.message) {
            setError('apiError', { type: 'custom', message: data.error.message });
        } else if (data.type === 'auth/postRegister/fulfilled') {
            navigate('/registered');
        }
    };

    if (isAuth) {
        return <Navigate to='/' />
    }

    return (
        <Paper classes={{ root: styles.root }}>
            <Typography classes={{ root: styles.title }} variant='h5'>
                Create Account
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label='Login'
                    error={Boolean(errors?.login)}
                    helperText={errors.login?.message}
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
                    label='Full Name'
                    error={Boolean(errors?.full_name)}
                    helperText={errors.full_name?.message}
                    {...register('full_name', {
                        required: 'Enter your full name',
                        minLength: {
                            value: 4,
                            message: "Your name must be at least 4 characters"
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

                <TextField
                    className={styles.field}
                    label='Confirm Password'
                    type='password'
                    error={Boolean(errors.password_confirmation?.message)}
                    helperText={errors.password_confirmation?.message}
                    {...register('password_confirmation', {
                        required: 'Confirm password',
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
                        },
                        validate: (value) => {
                            if (watch('password') !== value) {
                                return "Your passwords do no match";
                            }
                        }
                    })}
                    fullWidth
                />

                <Button disabled={!isValid} onClick={() => clearErrors()} type='submit' size='large' variant='contained' fullWidth>
                    Register
                </Button>
                <Typography variant='body1' sx={{ color: 'red' }}>{errors.apiError?.message}</Typography>
            </form>
            <Link to="/login">Already have an account</Link>
        </Paper>
    );
};
