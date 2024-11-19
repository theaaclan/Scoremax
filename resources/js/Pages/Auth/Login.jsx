import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "90vh" }}
            >
                <div className="card shadow-lg" style={{ width: "400px" }}>
                    <div className="card-body">
                        <h4 className="card-title text-center mb-4">Log In</h4>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-success">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="mb-3">
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="form-control"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2 text-danger"
                                />
                            </div>

                            <div className="mb-3">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="form-control"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.password}
                                    className="mt-2 text-danger"
                                />
                            </div>

                            <div className="form-check mb-3">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                    className="form-check-input"
                                />
                                <label className="form-check-label text-muted small">
                                    Remember me
                                </label>
                            </div>

                            <div className="d-flex justify-content-between">
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="btn btn-link text-decoration-none text-muted"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}

                                <PrimaryButton
                                    className="btn btn-primary"
                                    disabled={processing}
                                >
                                    Log in
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
