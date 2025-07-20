!include "MUI2.nsh"

Page custom InstallOptionsPage
!insertmacro MUI_PAGE_INSTFILES

Function InstallOptionsPage
  !insertmacro MUI_HEADER_TEXT "Options" "Choisissez les options d'installation"
  nsDialogs::Create 1018
  Pop $0
  
  ${NSD_CreateCheckbox} 0 0 100% 12u "Lancer automatiquement au démarrage"
  Pop $1
  ${NSD_SetState} $1 1 ; Case cochée par défaut
  
  nsDialogs::Show
FunctionEnd

Function .onInstSuccess
  ${NSD_GetState} $1 $2
  ${If} $2 == 1
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "GPT_WRAPPER" "$INSTDIR\GPT_WRAPPER.exe"
  ${EndIf}
FunctionEnd