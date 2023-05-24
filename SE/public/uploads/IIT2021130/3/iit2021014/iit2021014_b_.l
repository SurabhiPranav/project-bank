%{
#include<stdio.h>
%}

%%

"int" fprintf(yyout,"float");
.|\n fprintf(yyout,"%s",yytext);

%%

int yywrap()
{
return 1;
}

int main(void)
{
yyin=fopen("input8.c","r");
yyout=fopen("output8.c","w");
yylex();
return 0;
}
