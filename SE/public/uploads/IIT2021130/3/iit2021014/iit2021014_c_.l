%{
#include<stdio.h>

%}

%%

[^\n]+\n               printf("//%s//", yytext);

%%
int yywrap(){ return 1; }
int main(int argc, char* argv[]) {
printf("Enter the Sentence : ");
    yylex();
    return 0;
}



