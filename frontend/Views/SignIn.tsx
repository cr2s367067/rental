import {useForm} from 'react-hook-form';import {zodResolver} from '@hookform/resolvers/zod';import {z} from 'zod';
const schema=z.object({email:z.email('Enter a valid email'),password:z.string().min(1,'Enter your password')});type Values=z.infer<typeof schema>;
export function SignIn({vm}:{vm:{signIn:(email:string,password:string)=>Promise<void>;error:string;busy:boolean}}){
 const {register,handleSubmit,formState:{errors}}=useForm<Values>({resolver:zodResolver(schema)});
 return <main className="signin"><section className="card"><p className="eyebrow">RENTAL WORKSPACE</p><h1>Property Management</h1><p>Sign in to your property workspace.</p><form onSubmit={handleSubmit(v=>vm.signIn(v.email,v.password))}>
 <label>Email<input type="email" autoComplete="username" {...register('email')}/></label>{errors.email&&<p role="alert">{errors.email.message}</p>}
 <label>Password<input type="password" autoComplete="current-password" {...register('password')}/></label>{errors.password&&<p role="alert">{errors.password.message}</p>}
 {vm.error&&<p role="alert">{vm.error}</p>}<button disabled={vm.busy} type="submit">{vm.busy?'Signing in…':'Sign in'}</button></form></section></main>;
}
