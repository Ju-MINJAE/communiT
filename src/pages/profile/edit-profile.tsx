import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { User, Camera, CheckCircle, XCircle } from 'lucide-react';
import PasswordInput from '@/components/PasswordInput';

const formSchema = z
  .object({
    userNickname: z
      .string()
      .trim()
      .nonempty('이름을 입력해 주세요.')
      .regex(
        /^[a-zA-Z0-9가-힣]*$/,
        '공백, 특수 문자, 그리고 자음이나 모음만으로 이루어진 한글은 사용할 수 없습니다.',
      )
      .min(2, '이름은 최소 2자 이상이어야 합니다.'),
    password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
    newPassword: z
      .string()
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .regex(/^(?!.*(.)\1\1).*$/, '같은 문자를 3번 이상 반복할 수 없습니다.'),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

const categoryOptions = ['축구', '농구', '야구', '테니스', '스쿠버다이빙', '수상스키', '런닝'];

const EditProfile = () => {
  const [profileImage, setProfileImage] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);

  const imageFileRef = useRef<HTMLInputElement>(null);
  const defaultImage = 'https://example.com/my-default-image.png';

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const userNicknameValue = watch('userNickname', '');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (category: string) => {
    setCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(c => c !== category)
        : [...prevCategories, category],
    );
  };

  const onSubmit = (data: FormData) => {
    // 프로필 수정 로직
    // 선택한 카테고리들을 제출하는 로직 추가

    console.log('프로필 수정 성공 : ', {
      profileImage,
      ...data,
    });
    console.log('선택된 카테고리:', categories);
  };

  const handleCancel = () => {
    setProfileImage('');
    reset();
    navigate('/my-profile');

    if (imageFileRef.current) {
      imageFileRef.current.value = '';
    }
  };

  return (
    <div className="overflow-hidden h-full mx-auto">
      <div className="relative p-8 space-y-2">
        <h1 className="text-3xl font-bold">정보 수정</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar size="lg">
                <AvatarImage src={profileImage || defaultImage} alt="Profile Picture" />
                <AvatarFallback>사용자</AvatarFallback>
              </Avatar>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => imageFileRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <Input
              id="profile-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              ref={imageFileRef}
            />
          </div>

          <div className="flex flex-col justify-center items-center space-y-4">
            <div className="relative w-[20rem] ">
              <Label htmlFor="name" className="text-sm font-medium">
                닉네임
              </Label>
              <div className="relative mt-1">
                <Input
                  id="name"
                  type="text"
                  placeholder="길동무가없는홍길동"
                  {...register('userNickname')}
                  className={`pl-10 pr-10 ${errors.userNickname ? 'border-red-500' : ''}`}
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
                {errors.userNickname ? (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 h-5 w-5" />
                ) : (
                  userNicknameValue.trim().length >= 2 && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 h-5 w-5" />
                  )
                )}
              </div>
              {errors.userNickname && (
                <p className="text-red-500 text-xs mt-1">{errors.userNickname.message}</p>
              )}
            </div>

            {/* 회원가입 기능 구현 완료 후 현재 비밀번호와 일치하는지 비교하는 기능 구현 예정 */}
            <PasswordInput
              id="password"
              label="현재 비밀번호"
              register={register('password')}
              error={errors.password}
            />
            <PasswordInput
              id="newPassword"
              label="새 비밀번호"
              register={register('newPassword')}
              error={errors.newPassword}
            />
            <PasswordInput
              id="confirmPassword"
              label="비밀번호 확인"
              register={register('confirmPassword')}
              error={errors.confirmPassword}
            />
          </div>

          <div className="w-[24rem] m-auto grid grid-cols-3 gap-2">
            {categoryOptions.map((category, index) => (
              <label
                key={index}
                htmlFor={index.toString()}
                className="flex items-center hover:cursor-pointer"
              >
                <Badge variant="options" className="flex items-center justify-between w-full">
                  <Checkbox
                    id={index.toString()}
                    checked={categories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <span className="flex-1 text-center">{category}</span>
                </Badge>
              </label>
            ))}
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <Button className="w-[9.5rem]" type="submit" variant="profile">
              저장
            </Button>
            <Button className="w-[9.5rem]" type="reset" variant="outline" onClick={handleCancel}>
              취소
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
