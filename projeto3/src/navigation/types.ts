import type { NavigatorScreenParams } from '@react-navigation/native';
import type { Pais } from '../types/country';

// Stack: Lista -> Detalhes -> (Modais) FavoritarModal / InfoModal
export type HomeStackParamList = {
  Lista: undefined;
  Detalhes: { id: string };
  FavoritarModal: { id: string; name: string };
  InfoModal: { country: Pais };
};

// Tab (embaixo): uma aba é a Stack acima, a outra é a tela de Favoritos
export type MainTabParamList = {
  InicioStack: NavigatorScreenParams<HomeStackParamList>;
  Favoritos: undefined;
};

// Drawer (menu lateral): envolve as Tabs + telas extras "Perfil" e "Sobre"
// -> é essa camada extra que fecha a combinação Drawer > Tab > Stack + Modal
export type RootDrawerParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Perfil: undefined;
  Sobre: undefined;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootDrawerParamList {}
  }
}
