#include <iostream>
#include <string>

class Dog {
private:
    std::string name;
    int age;

public:
    Dog(const std::string& name, int age) : name(name), age(age) {}

    void speak() {
        std::cout << "hello " << name << std::endl;
    }

    void rollOver() {
        std::cout << name << " rolled over" << std::endl;
    }
};

int main() {
    Dog dog("Buddy", 3);
    dog.speak();
    dog.rollOver();
    return 0;
}