const renderItem = ({ item }: { item: Item }) => (
    <View
      style={[
        styles.slide,
        {
          backgroundColor: item.bg,
        },
      ]}>
      <Text style={styles.title}>{item.title}</Text>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );
  const RenderPagination = ({
    activeIndex,
    slider,
    data,
    onIntroCompleted,
  }: RenderPaginationProps) => {
    const handleIntroCompleted = () => {
      onIntroCompleted();
    };
    return (
      <View style={styles.paginationContainer}>
        <SafeAreaView>
          <View style={styles.paginationDots}>
            {data.length > 1 &&
              data.map((_, i) => (
                <Pressable
                  key={i}
                  style={[
                    styles.dot,
                    i === activeIndex
                      ? { backgroundColor: "white" }
                      : { backgroundColor: "rgba(0, 0, 0, 0.2)" },
                  ]}
                  onPress={() => slider?.goToSlide(i, true)}
                />
              ))}
          </View>
          {activeIndex === data.length - 1 && (
            <View style={styles.buttonContainer}>
              <Pressable
                onPress={handleIntroCompleted}
                style={[styles.button, { backgroundColor: "#023e3f" }]}>
                <Text style={styles.buttonText}>Log in</Text>
              </Pressable>
              <Pressable onPress={handleIntroCompleted} style={styles.button}>
                <Text style={styles.buttonText}>Sign up</Text>
              </Pressable>
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  };




  <TextInput
    keyboardType='email-address'
    style={styles.input}

    placeholder="Enter Email"
    //onChangeText={(text) => { lemail = text; }}
    onChangeText={(text) => setEmail( text ) }
    value={email}
    />



    <TextInput
      style={styles.input}
      keyboardType='default'
      placeholder="Enter Full Name"
      //onChangeText={(text) => { lname = text; } }
      onChangeText={(text) => setName( text ) }
      value={name}
    />
