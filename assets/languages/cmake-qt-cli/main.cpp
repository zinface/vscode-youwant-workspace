
#include <QCoreApplication>
#include <QTextStream>
#include <QDebug>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);
    QTextStream out(stdout);

    out << "Hello World\n";

    return 0;
    // return a.exec();
}

