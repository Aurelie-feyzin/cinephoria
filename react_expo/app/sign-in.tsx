import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {fetchGetToken} from "@/api/auth";
import {useSession} from "@/context/authContext";
import {router} from "expo-router";

export interface LoginInput {
    username: string;
    password: string;
}

const LoginForm = () => {
    const { signIn } = useSession();
    const [loginKo, setLoginKo] = useState(false);
    const [messageKo, setMessageKo] = useState('');
    const emailInput = React.useRef<TextInput>(null);
    const passwordInput = React.useRef<TextInput>(null);

    const {control, handleSubmit, formState: {errors}} = useForm<LoginInput>({
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            setMessageKo('');
            setLoginKo(false);
            const response = await fetchGetToken(data);
            if (!response.ok) {
                const badResponse = await response.json();
                if (badResponse.code === 401 && badResponse.message === 'Invalid credentials.') {
                    setMessageKo('Identification impossible : émail et/ou mot de passe incorrect.');
                } else {
                    setMessageKo('Une erreur c\'est produite pendant la récupération de votre profil.)');
                }
                setLoginKo(true);
                return;
            }
            const tokenResponse = await response.json();
            signIn(tokenResponse.token, tokenResponse.refresh_token);
            router.replace('/');
        } catch (error) {
            // @ts-ignore
            if (error?.code === 401 && error?.message === 'Invalid credentials.') {
                setMessageKo('Identification impossible : émail et/ou mot de passe incorrect.');
            } else {
                setMessageKo('Une erreur c\'est produite pendant la récupération de votre profil.)');
            }
            setLoginKo(true);
        }
    };

    return (
        <Pressable onPress={Keyboard.dismiss} className="flex-1 justify-center px-6 bg-gray-100">
            <View className="flex-1 justify-center">
                <SafeAreaView>
                    {loginKo &&
                        <View className="bg-red-100 border-t border-b border-red-500 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
                            <Text className="font-bold">"Erreur de connexion"</Text>
                            <Text className="text-sm">{messageKo}</Text>
                        </View>
                    }
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="space-y-6"
                    >
                        {/* Titre principal */}
                        <Text className="text-3xl font-bold text-secondary text-center">Cinephoria</Text>

                        {/* Sous-titre */}
                        <Text className="text-lg text-gray-500 text-center">Connectez vous</Text>

                        {/* Email input */}
                        <Pressable onPress={() => emailInput.current?.focus()} className="space-y-2">
                            <Text className="text-sm font-medium text-gray-700">Email</Text>
                            <Controller
                                control={control}
                                name="username"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect={false}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        onSubmitEditing={() => passwordInput.current?.focus()}
                                        ref={emailInput}
                                        returnKeyType="next"
                                        textContentType="username"
                                        value={value}
                                        className="p-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800"
                                    />
                                )}
                            />
                            {errors.username?.message && (
                                <Text role="alert" className="block text-white text-sm">{errors.username?.message}</Text>
                            )}
                        </Pressable>

                        {/* Password input */}
                        <Pressable onPress={() => passwordInput.current?.focus()} className="space-y-2">
                            <Text className="text-sm font-medium text-gray-700">Mot de passe</Text>
                            <Controller
                                control={control}
                                name="password"
                                render={({field: {onChange, onBlur, value}}) => (
                                    <TextInput
                                        autoCapitalize="none"
                                        autoComplete="password"
                                        autoCorrect={false}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        onSubmitEditing={handleSubmit(onSubmit)}
                                        ref={passwordInput}
                                        returnKeyType="done"
                                        secureTextEntry
                                        textContentType="password"
                                        value={value}
                                        className="p-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800"
                                    />
                                )}
                            />
                            {errors.password?.message && (
                                <Text role="alert" className="block text-white text-sm">{errors.password?.message}</Text>
                            )}
                        </Pressable>

                        {/* Forgot Password link */}
                        <View className="items-center">
                            <Text className="text-sm text-primary">Mot de passe oublié ?</Text>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity onPress={handleSubmit(onSubmit)} className="mt-4 bg-primary p-4 rounded-lg">
                            <View className="flex items-center">
                                <Text className="text-white font-semibold">Continue</Text>
                            </View>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        </Pressable>
    );
};

export default LoginForm;


