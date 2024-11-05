import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import NicknameInput from '@/components/NicknameInput';
import PasswordInput from '@/components/PasswordInput';
import CategorySelector from '@/components/CategorySelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const nicknameSchema = z.object({
  nickname: z
    .string()
    .trim()
    .nonempty('이름을 입력해 주세요.')
    .regex(
      /^[a-zA-Z0-9가-힣]*$/,
      '공백, 특수 문자, 그리고 자음이나 모음만으로 이루어진 한글은 사용할 수 없습니다.',
    )
    .min(2, '이름은 최소 2자 이상이어야 합니다.'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
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

type NicknameFormData = z.infer<typeof nicknameSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const categoryOptions = ['축구', '농구', '야구', '테니스', '스쿠버 다이빙', '수상스키', '런닝'];

const EditProfile = () => {
  const [profileImage, setProfileImage] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const imageFileRef = useRef<HTMLInputElement>(null);
  const defaultImage = 'https://example.com/my-default-image.png';

  const {
    register: registerNickname,
    handleSubmit: handleSubmitNickname,
    formState: { errors: nicknameErrors },
  } = useForm<NicknameFormData>({
    resolver: zodResolver(nicknameSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

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

  const handleImageSubmit = async () => {
    // 이미지 업로드 로직
    toast({
      title: '프로필 이미지 업데이트',
      description: '프로필 이미지가 성공적으로 업데이트되었습니다.',
    });
  };

  const toggleCategory = (category: string) => {
    setCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(c => c !== category)
        : [...prevCategories, category],
    );
  };

  const handleCategorySubmit = async () => {
    // 카테고리 업데이트 로직
    console.log('선택된 카테고리:', categories);
    toast({
      title: '카테고리 업데이트',
      description: '카테고리가 성공적으로 업데이트되었습니다.',
    });
  };

  const onSubmitNickname = async (data: NicknameFormData) => {
    // 닉네임 업데이트 로직
    console.log('닉네임 업데이트:', data);
    toast({
      title: '닉네임 업데이트',
      description: '닉네임이 성공적으로 업데이트되었습니다.',
    });
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    // 비밀번호 업데이트 로직
    console.log('비밀번호 업데이트:', data);
    toast({
      title: '비밀번호 업데이트',
      description: '비밀번호가 성공적으로 업데이트되었습니다.',
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">정보 수정</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>프로필 이미지 변경</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32">
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
            <Button onClick={handleImageSubmit}>이미지 업데이트</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>닉네임 변경</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitNickname(onSubmitNickname)} className="space-y-4">
              <NicknameInput
                id="nickname"
                label="닉네임"
                register={registerNickname('nickname')}
                error={nicknameErrors.nickname}
              />
              <div className="flex justify-center">
                <Button type="submit">닉네임 업데이트</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>비밀번호 변경</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-4">
              <PasswordInput
                id="currentPassword"
                label="현재 비밀번호"
                register={registerPassword('currentPassword')}
                error={passwordErrors.currentPassword}
              />
              <PasswordInput
                id="newPassword"
                label="새 비밀번호"
                register={registerPassword('newPassword')}
                error={passwordErrors.newPassword}
              />
              <PasswordInput
                id="confirmPassword"
                label="비밀번호 확인"
                register={registerPassword('confirmPassword')}
                error={passwordErrors.confirmPassword}
              />
              <div className="flex justify-center">
                <Button type="submit">비밀번호 업데이트</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>카테고리 변경</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CategorySelector
              categories={categoryOptions}
              selectedCategories={categories}
              toggleCategory={toggleCategory}
            />
            <div className="flex justify-center">
              <Button onClick={handleCategorySubmit}>카테고리 업데이트</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;
