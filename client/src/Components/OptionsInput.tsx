
export const OptionsInput = (props: OptionsInputProps) => {
    return <Container position="relative">
    <Input
      type="text"
      value={inputEducation.school}
      placeholder="School"
      name="school"
      onChange={(e) => onChangeEducation('school', e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />

    <Suggestions show={universities.length > 0}>
      {universities.map((university, index) => (
        <Suggestion
          key={index}
          onClick={() => {
            onChangeEducation('school', university.name);
            setUniversities([]);
          }}
        >
          <Text fontSize={14} fontWeight={'bold'}>
            {university.name}
          </Text>
          <Text fontSize={13}>{university.country}</Text>
        </Suggestion>
      ))}
    </Suggestions>
  </Container>
}