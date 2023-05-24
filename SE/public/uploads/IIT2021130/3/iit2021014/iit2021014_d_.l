%{
%}
start \/\*
end \*\/
%%

\/\/(.*) ;

{start}.*{end} ;

%%

int yywrap()
{
return 1;
}

int main(void)
{
yyin=fopen("input8.c","r");
yyout=fopen("out.c","w");
yylex();
return 0;
}

