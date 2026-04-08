class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def speak(self):
        print("hello " + self.name)

    def rollOver(self):
        print(self.name + " rolled over")


if __name__ == "__main__":
    dog = Dog("dog", 0)
    dog.speak()
    dog.rollOver()