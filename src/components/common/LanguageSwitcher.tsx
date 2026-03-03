import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language.startsWith('es');

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => i18n.changeLanguage(isSpanish ? 'en' : 'es')}
      className="font-semibold text-sm w-12"
    >
      {isSpanish ? 'EN' : 'ES'}
    </Button>
  );
}
