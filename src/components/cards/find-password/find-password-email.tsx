import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FindPasswordEmail = () => {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl mb-2">이메일 전송 완료</CardTitle>
        <div className="relative mb-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-center mt-8">
        <div className="font-bold text-xl mb-8">m@example.com</div>
        <CardDescription>비밀번호 재설정 메일이 발송되었습니다</CardDescription>
        <div className="pt-4 mt-16 ">
          <Button className="w-full ">확인</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FindPasswordEmail;
