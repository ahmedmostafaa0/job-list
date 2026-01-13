import Google from '@/public/google.svg';
import GitHub from '@/public/github_dark.svg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { signIn } from '@/lib/auth';
import SubmitButton from '../general/SubmitButtons';

const LoginForm = () => {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <form action={async () => {
                'use server'
                await signIn('github', {
                    redirectTo: '/onboarding'
                })
              }}>
                <SubmitButton variant='outline' width='w-full' text='Login with GitHub' imageSrc={GitHub} />
              </form>
              <form action={async() => {
                'use server'
                await signIn('google', {
                  redirectTo: '/onboarding'
                })
              }}>
                <SubmitButton variant='outline' width='w-full' text='Login with Google' imageSrc={Google} />
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and Privacy Policy.
      </div>
    </div>
  );;
};

export default LoginForm;
